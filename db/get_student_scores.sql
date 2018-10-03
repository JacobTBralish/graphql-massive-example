SELECT students.*, assessments.assessment_name, assessments_status.assess_id, assessments_status.passed, assessments_status.notes FROM students
JOIN assessments_status on(assessments_status.student_id = students.id)
JOIN assessments on(assessments.id = assessments_status.assess_id)
WHERE students.id = $1 AND assessments.id = $2
ORDER BY assessments.id;