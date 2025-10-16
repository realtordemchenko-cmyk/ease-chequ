// Client entity used for dashboard counts and client lists.
// id is required to support deleteClient and consistent logging.
export interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
}