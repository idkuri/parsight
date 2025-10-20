import { ParsightAPI } from '@contexts/APIContext';

/**
 * Fetches the list of workflows for a specific organization.
 *
 * @async
 * @function
 * @param {string} accessToken - The access token for authentication.
 * @param {string|number} org_id - The ID of the organization.
 * @returns {Promise<Object>} The response data containing the organization's workflows.
 */
export const getOrganizationWorkflows = async (accessToken, org_id) => {
    const resp = await ParsightAPI.get(`/organization/${org_id}/workflows`, 
        {
            headers: { Authorization: `Bearer ${accessToken}` }
        }
    )
    return resp.data
}

/**
 * Fetches the list of workflows for a specific organization.
 *
 * @async
 * @function
 * @param {string} accessToken - The access token for authentication.
 * @param {string} org_id - The ID of the organization.
 * @param {string} project_id - The ID of the project.
 * @param {string} workflow_id - The ID of the workflow
 * @param {FileList} files - List of files workflow is executing on
 * @returns {Promise<Object>} The response data containing the organization's workflows.
 */
export const executeWorkflow = async (accessToken, org_id, project_id, workflow_id, files) => {
    const resp = await ParsightAPI.post(`/organization/${org_id}/workflow/${workflow_id}/execute`,
        {
            project_id: project_id,
            files: files
        },
        {
            headers: { Authorization: `Bearer ${accessToken}` }
        },
    )

}

