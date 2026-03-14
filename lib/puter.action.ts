import puter from "@heyputer/puter.js";
import {getOrCreateHostingConfig, uploadImageToHosting} from "./puter.hosting";
import {isHostedUrl} from "./utils";
import {PUTER_WORKER_URL} from "./constants";

export const signIn = async () => await puter.auth.signIn();

export const signOut = () => puter.auth.signOut();

export const getCurrentUser = async () => {
    try {
        return await puter.auth.getUser();
    } catch {
        return null;
    }
}

export const createProject = async ({ item, visibility = "private" }: CreateProjectParams): Promise<DesignItem | null | undefined> => {
    if(!PUTER_WORKER_URL) {
        console.warn('Missing VITE_PUTER_WORKER_URL; skip history fetch;');
        return null;
    }
    const projectId = item.id;

    const hosting = await getOrCreateHostingConfig();

    // Attempt to upload source and rendered images to puter hosting.
    const hostedSource = projectId
        ? await uploadImageToHosting({ hosting, url: item.sourceImage, projectId, label: 'source' })
        : null;

    const hostedRender = projectId && item.renderedImage
        ? await uploadImageToHosting({ hosting, url: item.renderedImage, projectId, label: 'rendered' })
        : null;

    if (import.meta.env.DEV) {
        console.debug('createProject hosting result:', { hosting, hostedSource, hostedRender });
    }

    const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage)
        ? item.sourceImage
        : ''
    );

    if(!resolvedSource) {
        console.error('Failed to host source image, skipping save.', { item, hosting, hostedSource });
        return null;
    }

    const resolvedRender = hostedRender?.url
        ? hostedRender?.url
        : item.renderedImage && isHostedUrl(item.renderedImage)
            ? item.renderedImage
            : undefined;

    const {
        sourcePath: _sourcePath,
        renderedPath: _renderedPath,
        publicPath: _publicPath,
        ...rest
    } = item;

    const payload = {
        ...rest,
        sourceImage: resolvedSource,
        renderedImage: resolvedRender,
    }

    try {
        const url = `${PUTER_WORKER_URL}/api/projects/save`;

        if (import.meta.env.DEV) console.debug('Saving project to', url, 'payload', payload);

        const response = await puter.workers.exec(url, {
            method: 'POST',
            body: JSON.stringify({ project: payload, visibility })
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '<unable to read response body>');
            console.error('failed to save the project', { status: response.status, text });
            return null;
        }

        const data = (await response.json()) as { project?: DesignItem | null };

        if (import.meta.env.DEV) console.debug('Project saved response:', data);

        return data?.project ?? null;
    } catch (e) {
        console.error('Failed to save project', e, { payload });
        return null;
    }
}

export const getProjects = async () => {
    if(!PUTER_WORKER_URL) {
        console.warn('Missing VITE_PUTER_WORKER_URL; skip history fetch;');
        return []
    }

    try {
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/list`, { method: 'GET' });

        if(!response.ok) {
            console.error('Failed to fetch history', await response.text());
            return [];
        }

        const data = (await response.json()) as { projects?: DesignItem[] | null };

        return Array.isArray(data?.projects) ? data?.projects : [];
    } catch (e) {
        console.error('Failed to get projects', e);
        return [];
    }
}

export const getProjectById = async ({ id }: { id: string }) => {
    if (!PUTER_WORKER_URL) {
        console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
        return null;
    }

    console.log("Fetching project with ID:", id);

    try {
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
            { method: "GET" },
        );

        console.log("Fetch project response:", response);

        if (!response.ok) {
            console.error("Failed to fetch project:", await response.text());
            return null;
        }

        const data = (await response.json()) as {
            project?: DesignItem | null;
        };

        console.log("Fetched project data:", data);

        return data?.project ?? null;
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
};
