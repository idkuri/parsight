import { createContext, useContext, useState,useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { getOrganizationWorkflows } from '@API/WorkflowsAPI';

const OrganizationContext = createContext(null);

export const useOrganization = () => useContext(OrganizationContext);

export const OrganizationProvider = ({ children }) => {
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [workflows, setWorkflows] = useState([])
    const [organizations, setOrganizations] = useState([]);
    const { accessToken } = useAuth();

    const fetchWorkflows = async () => {
        try {
            const resp = await getOrganizationWorkflows(
                accessToken, 
                selectedOrg.org_id
            )
            setWorkflows(resp)
        } catch (err) {
            console.error("Failed to fetch workflows", err);
        }	
    }
    
    useEffect(() => {
        if (accessToken && selectedOrg) {
            fetchWorkflows();
        }
    }, [selectedOrg]);

    return (
        <OrganizationContext.Provider value={{ selectedOrg, setSelectedOrg, organizations, setOrganizations, workflows, setWorkflows }}>
            {children}
        </OrganizationContext.Provider>
    );
};