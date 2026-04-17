import React from "react"
import { Link, useParams } from "react-router"

const Interview = () => {
    const { id } = useParams()

    return (
        <main className="home-page">
            <header className="page-header">
                <h1>Interview Plan</h1>
                <p>Your report was generated successfully.</p>
            </header>

            <div className="interview-card">
                <div className="interview-card__footer">
                    <span className="footer-info">Report ID: {id}</span>
                    <Link className="generate-btn" to="/">Create Another Plan</Link>
                </div>
            </div>
        </main>
    )
}

export default Interview
