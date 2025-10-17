// Client entity used for dashboard counts and client lists.
// id is required to support deleteClient and consistent logging.
// agentId binds a client to an owning agent (single-owner model, scalable and simple).
export interface Client {
    id: string;
    agentId: string;
    name: string;
    email: string;
    phone?: string;
}