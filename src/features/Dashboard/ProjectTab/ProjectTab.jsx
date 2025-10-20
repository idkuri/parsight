import React, { useEffect, useState } from 'react';
import {
	Plus,
	X,
	File,
	Play,
	FileText,
	Image,
	Music,
	Video,
	Archive,
	Code,
	Folder,
	ArrowRight,
	ArrowLeft
} from 'lucide-react';
import { createProjectAPI, getProjectsByOrganizationAPI } from '@API/ProjectAPI';
import { useAuth } from '@contexts/AuthContext';
import { useOrganization } from '@contexts/OrganizationContext';
import RenderProject from './RenderProject';
import { getOrganizationWorkflows } from '@API/WorkflowsAPI';

const ProjectTab = (props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [projectName, setProjectName] = useState('');
	const { selectedOrg } = useOrganization();
	const { accessToken } = useAuth();
	const [projectData, setProjectData] = useState([]);
	const [selectedProject, setSelectedProject] = useState(null);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => {
		setIsModalOpen(false);
		setProjectName('');
	};

	const handleCardClick = (project) => {
		setSelectedProject(project);
	};

	const closeFolderModal = () => setSelectedProject(null);

	useEffect(() => {
		if (selectedOrg) {
			const fetchProjects = async () => {
				try {
					const resp = await getProjectsByOrganizationAPI(
						accessToken,
						selectedOrg.org_id
					);
					setProjectData(resp || []);
				} catch (err) {
					console.error('Failed to fetch projects:', err);
				}
			};

			fetchProjects()
		}
	}, [selectedOrg]);

	const handleCreateProject = async () => {
		if (!projectName) return alert('Please enter a project name!');
		try {
			await createProjectAPI(accessToken, selectedOrg?.org_id, projectName);
			setProjectName('');
			closeModal();

			// Refresh project list after creating a project
			const resp = await getProjectsByOrganizationAPI(
				accessToken,
				selectedOrg?.org_id
			);
			setProjectData(resp || []);
		} catch (err) {
			console.error('Failed to create project:', err);
		}
	};

	return (
		<div className="flex flex-col p-5 w-full h-full rounded-r-lg min-w-[200px]">
			{/* Header */}
            {!selectedProject &&
                <article className='fade-in'>
                <div className="flex flex-row items-center justify-between">
			    	<div className="flex flex-col  pt-2 w-full gap-3">
			    		<h1 className="text-4xl font-extrabold">Projects</h1>
			    		<span className="text-s text-gray-300">
			    			Manage your organization's projects and workflows
			    		</span>
			    	</div>
			    	<button
			    		onClick={openModal}
			    		className="flex flex-row items-center justify-center h-[50px] p-2 pr-5 button-gradient-rounded rounded-lg"
			    	>
			    		<Plus className="w-[50px] h-[50px] p-2 hover:cursor-pointer rounded-lg" />
			    		<span className="whitespace-nowrap">New Project</span>
			    	</button>
			    </div>

			    <hr className="border-t border-gray-700 mb-4 w-full" />

			    {/* Project Cards */}
			    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			    	{projectData?.length > 0 ? (
			    		projectData.map((project) => (
			    			<div
			    				key={project.id}
			    				className="bg-elem p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer flex items-center gap-3"
			    				onClick={() => handleCardClick(project)}
			    			>
			    				<div>
			    					<h3 className="text-xl font-semibold mb-1">{project.name}</h3>
			    					<p className="text-gray-400 text-sm">
			    						Author: {project.author}
			    					</p>
			    					<p className="text-gray-400 text-sm">
			    						Organization: {project.organization_name}
			    					</p>
			    				</div>
			    			</div>
			    		))
			    	) : (
			    		<p className="text-gray-400 col-span-full">No projects available.</p>
			    	)}
			    </div>

			    {/* Create Project Modal */}
			    {isModalOpen && (
			    	<div
			    		className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
			    		onClick={closeModal}
			    	>
			    		<div
			    			className="bg-card p-6 rounded-lg w-[400px]"
			    			onClick={(e) => e.stopPropagation()}
			    		>
			    			<h2 className="text-xl font-bold mb-4">Create New Project</h2>
			    			<input
			    				type="text"
			    				placeholder="Project Name"
			    				value={projectName}
			    				onChange={(e) => setProjectName(e.target.value)}
			    				className="w-full p-2 mb-4 rounded-lg border border-gray-700 bg-gray-800 text-white"
			    			/>
			    			<div className="flex justify-end gap-3">
			    				<button
			    					onClick={closeModal}
			    					className="px-4 py-2 rounded-lg border border-gray-700"
			    				>
			    					Cancel
			    				</button>
			    				<button
			    					onClick={handleCreateProject}
			    					className="px-4 py-2 rounded-lg button-gradient-rounded"
			    				>
			    					Create
			    				</button>
			    			</div>
			    		</div>
			    	</div>
			    )}
                </article>            
            }

			{/* FolderModal with fake files/workflows */}
			{selectedProject && (
                <RenderProject project={selectedProject} onClose={closeFolderModal} onBack={() => {setSelectedProject(null)}} />
			)}
		</div>
	);
};

export default ProjectTab;