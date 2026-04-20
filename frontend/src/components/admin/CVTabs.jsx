import { useState } from "react"
import EducationTab from "./cv/EducationTab"
import ExperienceTab from "./cv/ExperienceTab"
import SkillsTab from "./cv/SkillsTab"
import CertificatesTab from "./cv/CertificatesTab"
import ProjectsTab from "./cv/ProjectsTab"

const tabs = [
    { label: "Education",    key: "education" },
    { label: "Experience",   key: "experience" },
    { label: "Skills",       key: "skills" },
    { label: "Certificates", key: "certificates" },
    { label: "Projects",     key: "projects" },
]

function CVTabs() {
    const [activeTab, setActiveTab] = useState("education")

    return (
        <div>
            {/* Tab bar */}
            <div className="flex gap-1 mb-6 border-b border-gray-100 pb-1 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors"
                        style={activeTab === tab.key
                            ? { backgroundColor: "#1E3A8A", color: "#fff" }
                            : { backgroundColor: "transparent", color: "#6b7280" }
                        }
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "education"    && <EducationTab />}
            {activeTab === "experience"   && <ExperienceTab />}
            {activeTab === "skills"       && <SkillsTab />}
            {activeTab === "certificates" && <CertificatesTab />}
            {activeTab === "projects"     && <ProjectsTab />}
        </div>
    )
}

export default CVTabs
