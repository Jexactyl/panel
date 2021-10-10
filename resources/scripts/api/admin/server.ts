import useSWR, { SWRResponse } from 'swr';
import { AxiosError } from 'axios';
import { useRouteMatch } from 'react-router-dom';
import http from '@/api/http';
import { Model, UUID, withRelationships, WithRelationships } from '@/api/admin/index';
import { AdminTransformers } from '@/api/admin/transformers';
import { Allocation, Node } from '@/api/admin/node';
import { User } from '@/api/admin/user';
import { Egg, EggVariable } from '@/api/admin/egg';
import { Nest } from '@/api/admin/nest';

/**
 * Defines the limits for a server that exists on the Panel.
 */
interface ServerLimits {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads: string | null;
    oomDisabled: boolean;
}

export interface ServerVariable extends EggVariable {
    serverValue: string;
}

/**
 * Defines a single server instance that is returned from the Panel's admin
 * API endpoints.
 */
export interface Server extends Model {
    id: number;
    uuid: UUID;
    externalId: string | null;
    identifier: string;
    name: string;
    description: string;
    status: string;
    userId: number;
    nodeId: number;
    allocationId: number;
    eggId: number;
    nestId: number;
    limits: ServerLimits;
    featureLimits: {
        databases: number;
        allocations: number;
        backups: number;
    };
    container: {
        startup: string;
        image: string;
        environment: Record<string, string>;
    };
    createdAt: Date;
    updatedAt: Date;
    relationships: {
        allocations?: Allocation[];
        nest?: Nest;
        egg?: Egg;
        node?: Node;
        user?: User;
        variables?: ServerVariable[];
    };
}

/**
 * A standard API response with the minimum viable details for the frontend
 * to correctly render a server.
 */
type LoadedServer = WithRelationships<Server, 'allocations' | 'user' | 'node'>;

/**
 * Fetches a server from the API and ensures that the allocations, user, and
 * node data is loaded.
 */
export const getServer = async (id: number | string): Promise<LoadedServer> => {
    const { data } = await http.get(`/api/application/servers/${id}`, {
        params: {
            include: [ 'allocations', 'user', 'node' ],
        },
    });

    return withRelationships(AdminTransformers.toServer(data), 'allocations', 'user', 'node');
};

/**
 * Returns an SWR instance by automatically loading in the server for the currently
 * loaded route match in the admin area.
 */
export const useServerFromRoute = (): SWRResponse<LoadedServer, AxiosError> => {
    const { params } = useRouteMatch<{ id: string }>();

    return useSWR(`/api/application/servers/${params.id}`, async () => getServer(params.id), {
        revalidateOnMount: false,
        revalidateOnFocus: false,
    });
};