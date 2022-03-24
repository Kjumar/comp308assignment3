import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useAuthToken, useAuthUserToken } from "../config/auth";

export const loginMutationGQL = gql`
  mutation login($studentNumber: String!, $password: String!) {
    login(studentNumber: $studentNumber, password: $password ) {
      token
      studentId
    }
  }
`;

export const useLoginMutation = () => {
    const [_, setAuthToken, removeAuthtoken] = useAuthToken();
    const [__, setAuthUserToken, removeAuthUsertoken] = useAuthUserToken();
  
    const [mutation, mutationResults] = useMutation(loginMutationGQL, {
      onCompleted: (data) => {
        
        setAuthToken(data.login.token);
        setAuthUserToken(data.login.studentId);
  
      },
    });
  
    // full login function
    const login = (user, password) => {
      removeAuthtoken(); 
      removeAuthUsertoken();
      
      return mutation({
        variables: {
          studentNumber: user,
          password,
        }
      });
    }
    return [login, mutationResults]
  };