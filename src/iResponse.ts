/**
 * 
 */
export interface iResponse {
    status: number;
}

/**
 * iResponse for skills that answers a query
 */
export interface iQueryResponse extends iResponse {

}
/**
 * iResponse for skills that perform some action on the users data
 */
export interface iDoResponse extends iResponse {

}