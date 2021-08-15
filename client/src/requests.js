import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "apollo-boost";
import gql from "graphql-tag";
import { isLoggedIn, getAccessToken } from "./auth";

const ENDPOINT_URL = "http://localhost:9000/graphql";

const authLink = new ApolloLink((operation, forward) => {
    if (isLoggedIn()) {
        operation.setContext({
            headers: {
                'authentication': 'Bearer ' + getAccessToken()
            }
        });
    }
    return forward(operation);
})

const client = new ApolloClient({
    link: ApolloLink.from([
        authLink,
        new HttpLink({ uri: ENDPOINT_URL })
    ]),
    cache: new InMemoryCache()
});

const jobDeatailFragment = gql`
    fragment JobDetail on Job {
        id
        title
        company {
            id
            name
        }
        description
    }
`;

const createJobMutation = gql`
    mutation CreateJob($input: CreateJobInput){
        job: createJob(input: $input) {
            ...JobDetail
        }
    }
    ${jobDeatailFragment}
`;

const companyQuery = gql`
    query CompanyQuery($id: ID!) {
        company(id: $id) {
            id
            name
            jobs {
                id
                title
            }
            description
        }
    }
`;

const jobQuery = gql`
    query JobsQuery {
        jobs {
            id
            title
            company {
                id
                name
            }
        }
    }
`;

const loadJobQuery = gql`
    query JobQuery($id: ID!) {
        job(id: $id){
            ...JobDetail
        }
    }
    ${jobDeatailFragment}
`;

export const createJob = async (input) => {
    const { data: { job } } = await client.mutate({
        mutation: createJobMutation,
        variables: { input },
        update: (cache, { data }) => {
            cache.writeQuery({
                query: jobQuery,
                variables: { id: data.job.id },
                data
            })
        }
    });
    return job;
}

export const loadCompany = async (id) => {
    const { data: { company } } = await client.query({ query: companyQuery, variables: { id } });
    return company;
}

export const loadJob = async (id) => {
    const { data: { job } } = await client.query({ query: loadJobQuery, variables: { id } });
    return job;
}

export const loadJobs = async () => {
    const { data: { jobs } } = await client.query({ query: jobQuery, fetchPolicy: 'no-cache' });
    return jobs;
}
