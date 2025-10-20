import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { getUserOrganization } from '@API/UserAPI';
import { FolderOpen, Workflow, Building, Settings, ChevronDown, Check, PanelRight, Sidebar, LayoutDashboard} from 'lucide-react';
import ProjectTab from './ProjectTab';
import Organization from './Organization';
import { useOrganization } from '@contexts/OrganizationContext';
import UserSettings from './UserSettings';
import WorkflowBuilder from './WorkflowBuilderTab';

const Dashboard = () => {
    const { accessToken, authLoading, setAccessToken, userInfo } = useAuth();
    const [isSideBarActive, setSideBarActive] = useState(true);
    const [mode, setMode] = useState("projects");
    const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
    const { selectedOrg, setSelectedOrg, organizations, setOrganizations } = useOrganization();
    const [organizationLoading, setOrganizationLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const renderMap = {
        "projects": <ProjectTab/>,
        "workflows": <WorkflowBuilder/>,
        "organization": <Organization/>,
        "settings": <UserSettings/>
    }

    useEffect(() => {
        if (!userInfo) {
            navigate("/")
        }
    }, [userInfo])

    useEffect(() => {
        scrollTo(0, 0);
        if (!accessToken && !authLoading) {
            navigate("/");
        }
    }, [accessToken]);

    useEffect(() => {
        const fetchUserOrganization = async () => {
            if (accessToken) {
                try {
                    setOrganizationLoading(true);
                    const data = await getUserOrganization(accessToken);
                    setOrganizations(data);
                    setOrganizationLoading(false);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        fetchUserOrganization();
    }, [accessToken]);

    useEffect(() => {
        setSelectedOrg(organizations[0])
    }, [organizations])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOrgDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOrgSelect = (org) => {
        setSelectedOrg(org);
        setIsOrgDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsOrgDropdownOpen(!isOrgDropdownOpen);
    };

    return (
        accessToken && !authLoading && userInfo && !organizationLoading && selectedOrg &&
        <div data-component="dashboard-page" className='flex w-full p-2 fade-in max-h-[1080px]'>
            <div data-component="left-dashboard" className={`flex flex-col ${isSideBarActive ? "w-[25%] pt-8 pl-5 pr-5 bg-card" : "w-0 p-0 bg-primary"} h-full rounded-l-lg`} style={{ transition: 'width 300ms ease-in-out' }}>
            {isSideBarActive &&
                <>
                <div data-component="sidebar-header" className='flex flex-row items-center justify-between w-full text-2xl font-extrabold mb-4'>
                    <h4 className='font-bolder'>
                        Dashboard
                    </h4>
                </div>
                {/* Current Organization Display */}

                <div className="relative mb-4 px-3 py-2 bg-gray-900 rounded-lg hover:cursor-pointer" onClick={toggleDropdown} ref={dropdownRef}>
                    <div className="flex flex-row justify-between text-xs text-gray-400 mb-1 whitespace-nowrap">
                        Current Organization
                        <ChevronDown 
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                                isOrgDropdownOpen ? 'rotate-180' : ''
                            }`} 
                        />
                    </div>
                    <div className="text-sm font-medium text-gray-200 truncate">
                        {selectedOrg.org_name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {selectedOrg.role}
                    </div>
                    {/* Organization Dropdown */}
                    {isOrgDropdownOpen && (
                        <div className="absolute right-0 w-full bg-primary border border-gray-700 rounded-lg shadow-lg z-50">
                            <div className="py-2">
                                <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
                                    Organizations
                                </div>
                                {organizations.map((org) => (
                                    <button
                                        key={org.id}
                                        onClick={() => handleOrgSelect(org)}
                                        className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium">{org.org_name}</span>
                                            <span className="text-xs text-gray-400">{org.role}</span>
                                        </div>
                                        {selectedOrg?.org_id === org.org_id && (
                                            <Check className="w-4 h-4 text-green-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                
                
                {/* Divider */}
                <hr className="border-t border-gray-700 mb-4 w-full" />

                <div data-component="sidebar-navigation" className='flex flex-col w-full gap-5'>
                    <span className='text-xs text-gray-300'>Navigation</span>
                        <div data-component="dashboard-navigation-content" className='flex flex-col items-start gap-5 text-gray-300'>
                            {/* <button
                                className={`flex flex-row w-full gap-2 p-2 ${mode === "dashboard" ? "button-gradient-rounded-glow" : ""}`}
                                onClick={() => setMode("dashboard")}
                            >
                                <LayoutDashboard/>
                                <span>Dashboard</span>
                            </button> */}
                            <button
                                className={`flex flex-row w-full gap-2 p-2 ${mode === "projects" ? "button-gradient-rounded-glow" : ""}`}
                                onClick={() => setMode("projects")}
                            >
                                <FolderOpen/>
                                <span>Projects</span>
                            </button>

                            <button
                                className={`flex flex-row w-full gap-2 p-2 ${mode === "workflows" ? "button-gradient-rounded-glow" : ""}`}
                                onClick={() => setMode("workflows")}
                            >
                                <Workflow/>
                                <span>Workflow Builder</span>
                            </button>

                            <button
                                className={`flex flex-row w-full gap-2 p-2 ${mode === "organization" ? "button-gradient-rounded-glow" : ""}`}
                                onClick={() => setMode("organization")}
                            >
                                <Building/>
                                <span>Organization</span>
                            </button>
                            <button
                                className={`flex flex-row w-full gap-2 p-2 ${mode === "settings" ? "button-gradient-rounded-glow" : ""}`}
                                onClick={() => setMode("settings")}
                            >
                                <Settings/>
                                <span>Settings</span>
                            </button>
                        </div>
                </div>
            </>
            }
            </div>

            <div data-component="right-dashboard" className={`inline w-full bg-card rounded-r-lg overflow-y-hidden overflow-x-hidden ${isSideBarActive ? "" : "rounded-l-lg"}`}>
                <div className='flex flex-start flex-row pl-5 pt-5'>
                    <PanelRight className="hover:cursor-pointer w-8 h-8" onClick={() => {setSideBarActive(!isSideBarActive)}}/>
                </div>
                {renderMap[mode]}
            </div>
        </div>
    );
};

export default Dashboard;