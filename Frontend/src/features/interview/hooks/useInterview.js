import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, error, setError } = context
    const getErrorMessage = (error, fallbackMessage) => error?.response?.data?.message || error?.message || fallbackMessage

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        const normalizedJobDescription = (jobDescription || "").trim()
        const normalizedSelfDescription = (selfDescription || "").trim()

        if (!normalizedJobDescription) {
            setError("Job description is required.")
            return null
        }

        if (!resumeFile && !normalizedSelfDescription) {
            setError("Provide either a resume file or self description.")
            return null
        }

        setLoading(true)
        setError(null)
        let response = null
        try {
            response = await generateInterviewReport({
                jobDescription: normalizedJobDescription,
                selfDescription: normalizedSelfDescription,
                resumeFile
            })
            setReport(response.interviewReport)
            setError(null)
        } catch (error) {
            setError(getErrorMessage(error, "Failed to generate interview report. Please try again."))
        } finally {
            setLoading(false)
        }

        return response?.interviewReport || null
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        setError(null)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            setError(null)
        } catch (error) {
            setError(getErrorMessage(error, "Failed to fetch interview report."))
        } finally {
            setLoading(false)
        }
        return response?.interviewReport || null
    }

    const getReports = async () => {
        setLoading(true)
        setError(null)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
            setError(null)
        } catch (error) {
            setError(getErrorMessage(error, "Failed to fetch interview reports."))
        } finally {
            setLoading(false)
        }

        return response?.interviewReports || []
    }

    const getResumePdf = async (interviewReportId) => {
        const targetReport =
            report?._id === interviewReportId
                ? report
                : reports.find((item) => item._id === interviewReportId)

        if (!targetReport?.resume) {
            setError("Resume is not available for this report.")
            return
        }

        const fileContent = String(targetReport.resume)
        const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `resume_${interviewReportId}.txt`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    }



    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, error, generateReport, getReportById, getReports, getResumePdf }

}