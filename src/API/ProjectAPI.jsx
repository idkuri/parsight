import { ParsightAPI } from '@contexts/APIContext';

/**
 * Create a new project
 * @param {string} accessToken - Auth token
 * @param {string} organization_id - ID of the organization
 * @param {string} project_name - Name of the new project
 */
export async function createProjectAPI(accessToken, organization_id, project_name) {
    try {
        const res = await ParsightAPI.post(
            `/organization/${organization_id}/project/create`,
            { project_name },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return res.data;
    } catch (err) {
        console.error(`Create project error:`, err.response?.data?.error || err.message);
        throw err;
    }
}

/**
 * Get all projects for a specific organization
 * @param {string} accessToken - Auth token
 * @param {string} organization_id - ID of the organization
 */
export async function getProjectsByOrganizationAPI(accessToken, organization_id) {
    try {
        const res = await ParsightAPI.get(`/organization/${organization_id}/projects`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return res.data;
    } catch (err) {
        console.error(`Error fetching projects:`, err.response?.data?.error || err.message);
        throw err;
    }
}

/**
 * Get files for a specific project
 * @param {string} accessToken - Auth token
 * @param {string} project_id - ID of the project
 * @param {string} organization_id - ID of the organization
 */
export async function getProjectFilesAPI(accessToken, project_id, organization_id) {
    try {
        const res = await ParsightAPI.get(`organization/${organization_id}/project/${project_id}/files`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return res.data;

    } catch (err) {
        console.error(`Error fetching project files:`, err.response?.data?.error || err.message);
        throw err;
    }
}


/**
 * Upload files to a specific project
 * @param {string} accessToken - Auth token
 * @param {string} project_id - ID of the project
 * @param {string} organization_id - ID of the organization
 * @param {FormData} formData - FormData object containing one or more files
 * @returns {Promise<Object>} - Response containing success flag and uploaded files
 */
export async function uploadFilesAPI(accessToken, organization_id, project_id, formData) {
	try {
		const res = await ParsightAPI.post(
			`/organization/${organization_id}/project/${project_id}/files`,
			formData,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'multipart/form-data',
				},
			}
		);
		return res.data;
	} catch (err) {
		console.error(
			`Error uploading files`,
			err.response?.data?.error || err.message
		);
		throw err;
	}
}


/**
 * Delete a specific file from a project
 * @param {string} accessToken - Auth token
 * @param {string} project_id - ID of the project
 * @param {string} organization_id - ID of the organization
 * @param {string} filename - Name of the file to delete
 */
export async function deleteFileAPI(accessToken, organization_id, project_id, filename) {
	try {
		const res = await ParsightAPI.delete(
			`/organization/${organization_id}/project/${project_id}/file/delete`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				data: { filename }, // axios DELETE can send body using `data`
			}
		);
		return res.data;
	} catch (err) {
		console.error(
			`Error deleting file:`,
			err.response?.data?.error || err.message
		);
		throw err;
	}
}

/**
 * Download a specific file from a project
 * @param {string} accessToken - Auth token
 * @param {string} project_id - ID of the project
 * @param {string} organization_id - ID of the organization
 * @param {string} filename - Name of the file to download
 * @returns {Promise<Blob>} - The file content as a Blob
 */
export async function downloadFileAPI(accessToken, organization_id, project_id, filename) {
    try {
        const resp = await ParsightAPI.get(
            `/organization/${organization_id}/project/${project_id}/file/download`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { filename },
                responseType: 'blob',
            }
        );

        return resp.data;

    } catch (err) {
        console.error(
            `Error downloading file:`,
            err.response?.data?.error || err.message
        );
        throw err;
    }
}


/**
 * Download output document group for a specific workflow
 * @param {string} accessToken - Auth token
 * @param {string} organization_id - ID of the organization
 * @param {string} project_id - ID of the project
 * @param {string} workflow_id - ID of the workflow
 * @param {string} document_group_id - ID of the document group
 * @returns {Promise<Blob>} - The document group content as a Blob
 */
export async function downloadOutputDocumentGroupAPI(accessToken, organization_id, project_id, workflow_id, document_group_id) {
    const resp = await ParsightAPI.get(
        `/organization/${organization_id}/project/${project_id}/jobs/download`, {
            headers: { Authorization: `Bearer ${accessToken}`},
            params: { workflow_id, document_group_id },
            responseType: "blob",
        }
    )
    return resp
}

export async function downloadInputDocumentGroupAPI(accessToken, organization_id, project_id, workflow_id, document_group_id) {
    console.log(accessToken, organization_id, project_id, workflow_id, document_group_id)
}


/**
 * Fetches the list of jobs for a specific project within an organization.
 *
 * @async
 * @function
 * @param {string} accessToken - The access token for authentication (Bearer token).
 * @param {string|number} organization_id - The ID of the organization.
 * @param {string|number} project_id - The ID of the project.
 * @returns {Promise<Object>} The response data containing the jobs.
 * @throws Will throw an error if the request fails.
 */
export async function getJobsAPI(accessToken, organization_id, project_id) {
    try {
        const resp = await ParsightAPI.get(
            `/organization/${organization_id}/project/${project_id}/jobs`, {
                headers: { Authorization: `Bearer ${accessToken}`}
            }
        )

        return resp.data
    }
    catch (err) {
        console.error(
            `Error getting jobs in project ${project_id}:`,
            err.response?.data?.error || err.message
        );
        throw err;
    }
}