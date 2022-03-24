import {
    ApolloClient,
    createHttpLink,
    ApolloLink,
    InMemoryCache
} from '@apollo/client';

import { useAuthToken } from "./auth";

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql'
});

const authMiddleware = (authToken) =>
    new ApolloLink((operation, forward) => {
        // add the authorization to the headers
        if (authToken) {
            operation.setContext({
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
            });
        }
        return forward(operation);
    });

const cache = new InMemoryCache({});

export const useAppApolloClient = () => {
    const [authToken] = useAuthToken();
    return new ApolloClient({
        link: authMiddleware(authToken).concat(httpLink),
        cache,
    });
};