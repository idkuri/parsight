import React, { useState, useMemo, useEffect } from 'react';
import { File, Play, ArrowRight, ArrowLeft, CheckCircle, XCircle, Upload, Users, Calendar, Search, History, Download, Loader2, BriefcaseBusiness, MessageCircleMore, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFileIcon } from './utils/extensionMap';
import { getProjectFilesAPI, uploadFilesAPI, deleteFileAPI, downloadFileAPI, getJobsAPI, downloadOutputDocumentGroupAPI } from '@API/ProjectAPI';
import { executeWorkflow } from '@API/WorkflowsAPI';
import { useAuth } from "@contexts/AuthContext";
import { useOrganization } from '@contexts/OrganizationContext';
import MetricCard from "./components/MetricCard";
import FileItem from './components/FileItem';
import CategoryDropZone from './components/CategoryDropZone';

const RenderProject = ({ project = { id: 1, name: "Sample Project" }, onClose, onBack }) => {
    const [currentPhase, setCurrentPhase] = useState('files');
    const [direction, setDirection] = useState(1);
    const [existingFiles, setExistingFiles] = useState([]);
    const [uploadFileQueue, setUploadQueue] = useState([]);
    const [fileSearch, setFileSearch] = useState('');
    const [selectedWorkflow, setSelectedWorkflow] = useState(null);
    const [results, setResults] = useState([]);
    const [draggedFile, setDraggedFile] = useState(null);
    const [dragOverCategory, setDragOverCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [existingJobs, setExistingJobs] = useState([]);

    const { accessToken } = useAuth();
    const { selectedOrg, workflows } = useOrganization();

    if (!project) return null;

    const metrics = useMemo(() => {
        const now = new Date();
        const lastActivity = `${now.toLocaleDateString()}`;
        const memberCount = 5;
        return [
            { title: 'Files', value: existingFiles.length, icon: File, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
            { title: 'Workflows', value: workflows.length, icon: Play, color: 'text-secondary', bgColor: 'bg-secondary/10' },
            { title: 'Members', value: memberCount, icon: Users, color: 'text-green-500', bgColor: 'bg-green-500/10' },
            { title: 'Last Activity', value: lastActivity, icon: Calendar, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
        ];
    }, [existingFiles.length, workflows.length]);

    const filteredFiles = existingFiles.filter(file =>
        file.filename.toLowerCase().includes(fileSearch.toLowerCase())
    );

    const uncategorizedFiles = existingFiles.filter(file => !file.category);

    // Utility functions
    const getFileExtension = (filename) => filename.split('.').pop()?.toLowerCase();

    const canDropInCategory = (file, category) => {
        const fileExtension = getFileExtension(file.filename);
        
        if (!category.allowedTypes.includes(fileExtension)) {
            return false;
        }
        
        if (category.inputType === "single") {
            return existingFiles.filter(f => f.category?.id === category.id).length === 0;
        }
        
        return category.inputType === "list";
    };

    const canDropInAtLeastOneCategory = (file) => {
        const fileExtension = getFileExtension(file.filename);
        return categories.some(category => category.allowedTypes.includes(fileExtension));
    };

    // API functions
    const fetchExistingFiles = async () => {
        const res = await getProjectFilesAPI(accessToken, project.id, selectedOrg.org_id);
        const newFiles = res.files.map((file, index) => ({
            id: `upload_${Date.now()}_${index}`,
            filename: file.filename,
            filepath: file.filepath,
            category: null
        }));
        setExistingFiles(newFiles);
    };

    const fetchExistingJobs = async () => {
        const res = await getJobsAPI(accessToken, selectedOrg.org_id, project.id);
        setExistingJobs(res)
    }

    const handleDownloadFile = async (filename) => {
        const fileBlob = await downloadFileAPI(accessToken, selectedOrg.org_id, project.id, filename);
        const url = URL.createObjectURL(fileBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const handleDownloadOutputDocumentGroup = async (workflow_id, document_group_id) => {
        const resp = await downloadOutputDocumentGroupAPI(
            accessToken,
            selectedOrg.org_id,
            project.id,
            workflow_id,
            document_group_id
        );
    
        // Get filename from Content-Disposition header
        const disposition = resp.headers['content-disposition'];
        let filename = `output_${workflow_id}_${document_group_id}.zip`; // fallback
    
        if (disposition && disposition.includes('filename=')) {
            filename = disposition
                .split('filename=')[1]
                .replace(/["']/g, '');
        }
    
        const url = URL.createObjectURL(resp.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const handleDeleteFile = async (filename) => {
        try {
            await deleteFileAPI(accessToken, selectedOrg.org_id, project.id, filename);
            fetchExistingFiles();
        } catch (err) {
            console.error('Error deleting file:', err);
        }
    };
    // Event handlers
    const handleDragStart = (e, file) => {
        setDraggedFile(file);
        e.dataTransfer.effectAllowed = 'move';
    };
    const handleDragOver = (e, categoryId) => {
        e.preventDefault();
        if (draggedFile && canDropInCategory(draggedFile, categories.find(c => c.id === categoryId))) {
            e.dataTransfer.dropEffect = 'move';
            setDragOverCategory(categoryId);
        } else {
            e.dataTransfer.dropEffect = 'none';
        }
    };

    const handleDragLeave = () => setDragOverCategory(null);

    const handleDrop = (e, category) => {
        e.preventDefault();
        setDragOverCategory(null);

        
        if (draggedFile && canDropInCategory(draggedFile, categories.find(c => c.id === category.id))) {
            setExistingFiles(prev => 
                prev.map(file => 
                    file.id === draggedFile.id 
                        ? { ...file, category: category}
                        : file
                )
            );
        }
        setDraggedFile(null);
    };

    const handleDragEnd = () => {
        setDraggedFile(null);
        setDragOverCategory(null);
    };

    const removeFileFromCategory = (fileId) => {
        setExistingFiles(prev => 
            prev.map(file => 
                file.id === fileId 
                    ? { ...file, category: null }
                    : file
            )
        );
    };

    const handleWorkflowSelect = (workflow) => {
        setSelectedWorkflow(workflow);
        const document_groups = Object.entries(workflow.document_groups);
        
        const new_categories = document_groups.map(([categoryName, categoryConfig]) => {
            const dummyFileName = `file.${categoryConfig.file_type}`;
            const { icon: FileIcon, color, bgColor, borderColor } = getFileIcon(dummyFileName);
            
            return {
                id: categoryName,
                name: categoryName,
                allowedTypes: [categoryConfig.file_type],
                inputType: categoryConfig.input_type,
                icon: FileIcon,
                color,
                bgColor,
                borderColor
            };
        });
        
        setCategories(new_categories);
    };

    const handleRunWorkflow = async () => {
        setDirection(1);
        setCurrentPhase('results');

        const selectedFiles = existingFiles.filter((f) => f.category)
        await executeWorkflow(accessToken, selectedOrg.org_id, project.id, selectedWorkflow.id, selectedFiles);

        fetchExistingJobs();
        // const processed = existingFiles
        //     .filter(file => file.category !== null)
        //     .map(file => ({
        //         file,
        //         status: Math.random() > 0.2 ? 'success' : 'failed',
        //     }));
        
        // setTimeout(() => setResults(processed), 1000);
    };


    // Navigation
    const handleNext = () => {
        setDirection(1);
        setCurrentPhase('workflows');
    };

    const handleBack = () => {
        setDirection(-1);
        setCurrentPhase('files');
    };

    // Effects
    useEffect(() => {
        fetchExistingFiles();
    }, [project]);

    useEffect(() => {
        if (uploadFileQueue.length === 0) return;

        const upload = async () => {
            try {
                const formData = new FormData();
                uploadFileQueue.forEach(f => formData.append('files', f));
                await uploadFilesAPI(accessToken, selectedOrg.org_id, project.id, formData);
                setUploadQueue([]);
                fetchExistingFiles();
            } catch (err) {
                console.error('Error uploading files:', err);
            }
        };

        upload();
    }, [uploadFileQueue]);

    useEffect(() => {
    	fetchExistingJobs(); // initial fetch

    	const interval = setInterval(() => {
    		fetchExistingJobs();
    	}, 5000); // every 5 seconds

    	// cleanup on unmount
    	return () => clearInterval(interval);
    }, []);

    // Animation variants
    const variants = {
        enter: (custom) => ({
            x: custom > 0 ? 300 : -300,
            opacity: 0,
            position: 'absolute',
        }),
        center: {
            x: 0,
            opacity: 1,
            position: 'relative',
        },
        exit: (custom) => ({
            x: custom < 0 ? 300 : -300,
            opacity: 0,
            position: 'absolute',
        }),
    };

    const phaseConfig = {
        files: { title: 'Select project files', buttonText: 'Next: Select Workflow' },
        workflows: { title: 'Categorize files and pick a workflow to run', buttonText: 'Run Workflow' },
        results: { title: 'Workflow Results', buttonText: "Back to Home" }
    };

    return (
        <div className="flex flex-col w-full h-full relative px-5">
            <div className='flex flex-row'>
                {/* Header */}
                <div className="flex items-center mb-5 w-full gap-2">
                    <div className="relative group w-10 h-10">
                        <X
                            className="w-10 h-10 cursor-pointer text-foreground hover:text-red-500 hover:scale-110 transition-transform duration-100"
                            onClick={onBack}
                        />
                        <span className="absolute top-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Close Project
                        </span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">
                            {project.name}
                        </h2>
                        <p className="flex flex-row gap-2 text-sm text-muted-foreground mt-1">
                            {phaseConfig[currentPhase].title}
                            <History className="hover:cursor-pointer" onClick={() => {setCurrentPhase("results")}}/>
                        </p>
                    </div>
                </div>
                
                {/* Actions */}
                <div className="flex justify-between ml-auto whitespace-nowrap items-center">
                    <div>
                        {currentPhase === 'workflows' && (
                            selectedWorkflow ? (
                                <button
                                    onClick={() => setSelectedWorkflow(null)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg"
                                >
                                    <ArrowLeft /> Workflows
                                </button>
                            ) : (
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg"
                                >
                                    <ArrowLeft /> Files
                                </button>
                            )
                        )}
                    </div>
                    <div className="flex gap-3">
                        {currentPhase === 'files' && (
                            <button
                                onClick={handleNext}
                                disabled={existingFiles.length === 0}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg button-gradient-rounded-glow disabled:opacity-50"
                            >
                                {phaseConfig.files.buttonText} <ArrowRight />
                            </button>
                        )}
                        {currentPhase === 'workflows' && (
                            <button
                                onClick={handleRunWorkflow}
                                disabled={!selectedWorkflow}
                                className="px-6 py-3 rounded-lg color-green bg-green text-secondary-foreground button-gradient-rounded-glow hover:bg-secondary/90 disabled:opacity-50"
                            >
                                {phaseConfig.workflows.buttonText}
                            </button>
                        )}
                        {currentPhase === 'results' && (
                            <button
                                onClick={() => {setCurrentPhase("files")}}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg button-gradient-rounded-glow disabled:opacity-50"
                            >
                                <ArrowLeft />
                                {phaseConfig.results.buttonText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <hr className="border-t border-gray-700 mb-4 w-full" />

            {/* Animated Content */}
            <AnimatePresence mode="popLayout" custom={direction}>
                {/* Files Phase */}
                {currentPhase === 'files' && (
                    <motion.div
                        key="files"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="flex flex-col"
                    >
                        {/* Metrics */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                            {metrics.map((metric, index) => (
                                <MetricCard key={index} metric={metric} />
                            ))}
                        </div>

                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <File className="w-5 h-5 text-primary" /> Upload Project Files
                        </h3>

                        <div className='flex flex-row w-full gap-3'>
                            {/* File Upload */}
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const files = Array.from(e.dataTransfer.files);
                                    setUploadQueue(prev => [...prev, ...files]);
                                }}
                                className="relative flex flex-col items-center w-1/2 justify-center outline-1 bg-elem rounded-lg p-20 mb-4 cursor-pointer hover:outline-blue-500 transition-all"
                            >
                                <Upload />
                                <label htmlFor="file-upload" className="text-muted-foreground mb-2 text-center pointer-events-none">
                                    Drag & drop files here
                                </label>
                                <label htmlFor="file-upload" className="text-sm text-muted-foreground text-center pointer-events-none">
                                    or click to select files
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        setUploadQueue(prev => [...prev, ...files]);
                                    }}
                                    className="absolute inset-0 w-1/2 h-full opacity-0 cursor-pointer"
                                />
                            </div>

                            <div className='flex flex-col w-1/2'>
                                {/* Search Bar */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="relative w-full">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="Search files..."
                                            value={fileSearch}
                                            onChange={(e) => setFileSearch(e.target.value)}
                                            className="w-full pl-10 p-2 rounded-lg border border-border bg-elem text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Files List */}
                                <div className={`flex flex-col overflow-y-scroll no-scrollbar w-full h-auto min-h-[575px] rounded-md bg-elem my-5 ${
                                    filteredFiles.length === 0 ? "justify-center items-center" : ""
                                }`}>
                                    {filteredFiles.map(file => (
                                        <FileItem
                                            key={file.filename}
                                            file={file}
                                            onDownload={handleDownloadFile}
                                            onDelete={handleDeleteFile}
                                        />
                                    ))}
                                    {filteredFiles.length === 0 && (
                                        <p className="text-muted-foreground text-center">No files found</p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Workflows Phase */}
                {currentPhase === 'workflows' && (
                    <motion.div
                        key="workflows"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="flex flex-col w-full"
                    >
                        {/* Workflows Selection */}
                        <h3 className="text-lg font-semibold mb-5 flex gap-1 items-center">
                            <Play className="w-5 h-5 text-secondary fill-green-500" /> 
                            {`${selectedWorkflow ? 'Selected Workflow' : 'Available Workflows'}`}
                        </h3>

                        {selectedWorkflow &&
                        <div className="flex flex-col gap-10 mb-5">
                            <button
                                key={selectedWorkflow.id}
                                className={`flex items-center gap-3 p-4 rounded-lg w-full text-left transition-all button-gradient-rounded-glow`}
                            >
                                <div className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center">
                                    <Play className="w-5 h-5 text-secondary-foreground" />
                                </div>
                                <span className="text-secondary-foreground font-medium">{selectedWorkflow.name}</span>
                            </button>
                        </div>
                        }

                        <div className="flex flex-col gap-10 mb-5">
                            {!selectedWorkflow &&
                                <div className="w-full">
                                    {workflows.map(workflow => {
                                        const isSelected = selectedWorkflow?.id === workflow.id;
                                        return (
                                            <button
                                                key={workflow.id}
                                                onClick={() => handleWorkflowSelect(workflow)}
                                                className={`flex items-center gap-3 p-4 rounded-lg w-full text-left transition-all hover:scale-[1.02] group ${
                                                    isSelected ? 'button-gradient-rounded-glow' : ''
                                                }`}
                                            >
                                                <div className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center">
                                                    <Play className="w-5 h-5 text-secondary-foreground" />
                                                </div>
                                                <span className="text-secondary-foreground font-medium">{workflow.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            }

                            {/* File Categories */}
                            {selectedWorkflow && (
                                <div className="fade-in">
                                    <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                                        <File className="w-5 h-5 text-primary" /> Required Files 
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {categories.map(category => (
                                            <CategoryDropZone
                                                key={category.id}
                                                category={category}
                                                existingFiles={existingFiles}
                                                dragOverCategory={dragOverCategory}
                                                draggedFile={draggedFile}
                                                canDropInCategory={canDropInCategory}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                onRemoveFile={removeFileFromCategory}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Uncategorized Files */}
                            {selectedWorkflow && uncategorizedFiles.length > 0 && (
                                <div className='fade-in'>
                                    <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                                        <File className="w-5 h-5 text-primary" /> Project Files
                                    </h3>
                                    <div className="flex flex-col overflow-y-scroll no-scrollbar h-auto max-h-[275px] rounded-md bg-elem p-2 gap-2">
                                        {uncategorizedFiles.map(file => (
                                            <FileItem
                                                key={file.id}
                                                file={file}
                                                isDraggable={canDropInAtLeastOneCategory(file)}
                                                onDragStart={(e) => handleDragStart(e, file)}
                                                onDragEnd={handleDragEnd}
                                                draggedFile={draggedFile}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Results Phase */}
                {currentPhase === 'results' && (
                    <motion.div
                        key="results"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="mb-8"
                    >
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            Job History
                        </h3>
                        <div className="flex flex-col overflow-y-scroll no-scrollbar">
                            {existingJobs.length === 0 ? (
                                <p className="text-muted-foreground">No existing jobs...</p>
                            ) : (
                                    existingJobs.map(job => {
                                    	return (
                                    		<div
                                    			key={job.workflow_job_id}
                                    			className="flex items-center gap-3 p-4 bg-muted rounded-lg"
                                    		>
                                    			<div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                    				<BriefcaseBusiness />
                                    			</div>
                                    			<span className="font-medium">{job.workflow_job_id}</span>
                                        
                                    			{job.status === "COMPLETE" ? (
                                    				<>
                                    					<Download
                                    						className="w-5 h-5 text-green-500 hover:fill-green hover:text-white hover:cursor-pointer"
                                    						onClick={() => {
                                    							handleDownloadOutputDocumentGroup(
                                    								job.workflow_id,
                                    								job.document_group_id
                                    							);
                                    						}}
                                    					/>
                                    					<CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                                    				</>
                                    			) : job.status === "RUNNING" || job.status === "SUBMITTED" ? (
                                    				<>
                                    					<Loader2 className="w-5 h-5 text-blue-500 animate-spin ml-auto" />
                                    				</>
                                    			) : (
                                    				<>
                                    					<MessageCircleMore
                                    						className="w-5 h-5 text-red-500 hover:cursor-pointer hover:fill-red-500 hover:text-white"
                                    						onClick={() => {
                                    							alert(job.error_message);
                                    						}}
                                    					/>
                                    					<XCircle className="w-5 h-5 text-red-500 ml-auto" />
                                    				</>
                                    			)}
                                    		</div>
                                    	);
                                    })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RenderProject;