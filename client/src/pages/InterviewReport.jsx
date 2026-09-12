import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Step3Report from '../components/Step3Report'
import { ServerUrl } from '../App'

function InterviewReport() {
  const {id} = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(()=>{
    const fetchReport = async () => {
      try {
        const result = await axios.get(
          `${ServerUrl}/api/interview/report/${id}`,
          { withCredentials: true }
        );

        setReport(result.data.report);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load this interview report.");
      }
    }

    fetchReport();
},[id])
  return (
    <div>
      <Step3Report report={report} error={error} />
    </div>
  )
}

export default InterviewReport
