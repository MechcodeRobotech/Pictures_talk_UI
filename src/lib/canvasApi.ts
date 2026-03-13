// Canvas API client for backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface CanvasDocument {
  id: number;
  project_id: number;
  title: string | null;
  theme: string | null;
  language: string | null;
  canvas_width: number | null;
  canvas_height: number | null;
  background_color: string | null;
  canvas_data: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface CanvasDocumentCreate {
  project_id: number;
  title?: string;
  theme?: string;
  language?: string;
  canvas_width?: number;
  canvas_height?: number;
  background_color?: string;
}

export interface CanvasDocumentUpdate {
  title?: string;
  theme?: string;
  language?: string;
  canvas_width?: number;
  canvas_height?: number;
  background_color?: string;
  canvas_data?: Record<string, any>;
}

/**
 * Get user email from Clerk or localStorage
 */
function getUserEmail(): string | null {
  // TODO: Get from Clerk when integrated
  // For now, return null (guest user)
  return localStorage.getItem('userEmail');
}

/**
 * Create a new canvas document
 */
export async function createCanvasDocument(data: CanvasDocumentCreate): Promise<CanvasDocument> {
  const userEmail = getUserEmail();
  const url = new URL('/api/canvas-documents', API_BASE_URL);

  if (userEmail) {
    url.searchParams.append('user_email', userEmail);
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create canvas document: ${response.statusText}`);
  }

  return response.json();
}

/**
 * List canvas documents
 */
export async function listCanvasDocuments(projectId?: number): Promise<CanvasDocument[]> {
  const userEmail = getUserEmail();
  const url = new URL('/api/canvas-documents', API_BASE_URL);

  if (userEmail) {
    url.searchParams.append('user_email', userEmail);
  }

  if (projectId !== undefined) {
    url.searchParams.append('project_id', projectId.toString());
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to list canvas documents: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get a canvas document by ID
 */
export async function getCanvasDocument(documentId: number): Promise<CanvasDocument> {
  const userEmail = getUserEmail();
  const url = new URL(`/api/canvas-documents/${documentId}`, API_BASE_URL);

  if (userEmail) {
    url.searchParams.append('user_email', userEmail);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to get canvas document: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a canvas document (auto-save)
 */
export async function updateCanvasDocument(
  documentId: number,
  data: CanvasDocumentUpdate
): Promise<CanvasDocument> {
  const userEmail = getUserEmail();
  const url = new URL(`/api/canvas-documents/${documentId}`, API_BASE_URL);

  if (userEmail) {
    url.searchParams.append('user_email', userEmail);
  }

  const response = await fetch(url.toString(), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update canvas document: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a canvas document
 */
export async function deleteCanvasDocument(documentId: number): Promise<void> {
  const userEmail = getUserEmail();
  const url = new URL(`/api/canvas-documents/${documentId}`, API_BASE_URL);

  if (userEmail) {
    url.searchParams.append('user_email', userEmail);
  }

  const response = await fetch(url.toString(), {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete canvas document: ${response.statusText}`);
  }
}

/**
 * Get or create "Untitled Project" for guest user
 */
export async function getUntitledProjectId(): Promise<number> {
  const userEmail = getUserEmail();
  const url = new URL('/api/projects', API_BASE_URL);

  if (userEmail) {
    url.searchParams.append('user_email', userEmail);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to get projects: ${response.statusText}`);
  }

  const result = await response.json();

  // Find or create "Untitled Project"
  let untitledProject = result.items?.find((p: any) => p.name === 'Untitled Project');

  if (!untitledProject) {
    // Create new project - NOTE: This endpoint doesn't exist yet
    // For now, we'll need to handle this differently
    const createUrl = new URL('/api/projects', API_BASE_URL);
    if (userEmail) {
      createUrl.searchParams.append('user_email', userEmail);
    }

    const createResponse = await fetch(createUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Untitled Project',
        description: 'Auto-created project for canvas documents',
      }),
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create project: ${createResponse.statusText}`);
    }

    untitledProject = await createResponse.json();
  }

  return untitledProject.id;
}
