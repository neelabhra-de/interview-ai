import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function generateInterviewReport({ jobDescription, selfDescription, resumeFile }) {
    const formData = new FormData()

    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)

    if (resumeFile) {
        formData.append("resume", resumeFile)
    }

    const response = await api.post("api/interview", formData)
    return response.data
}
