import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

import React from 'react'
import LoadingExperience from "../../../components/LoadingExperience";

const Protected = ({children}) => {
    const {loading,user} = useAuth()
    

    if(loading){
        return (
            <LoadingExperience
                title='Checking your session'
                subtitle='Verifying access before opening your workspace.' />
        )
    }

    if(!user){
        return <Navigate to='/login' replace />
        
    }

  return children
}

export default Protected
