/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package ru.homework.hr.entities.auto;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;
import ru.homework.hr.entities.Employee;

/**
 *
 * @author mgr
 */
@Entity
@Table(name = "JOB_HISTORY")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "JobHistory.findAll", query = "SELECT j FROM JobHistory j"),
    @NamedQuery(name = "JobHistory.findByEmployeeId", query = "SELECT j FROM JobHistory j WHERE j.jobHistoryPK.employeeId = :employeeId"),
    @NamedQuery(name = "JobHistory.findByStartDate", query = "SELECT j FROM JobHistory j WHERE j.jobHistoryPK.startDate = :startDate"),
    @NamedQuery(name = "JobHistory.findByEndDate", query = "SELECT j FROM JobHistory j WHERE j.endDate = :endDate")})
public class JobHistory implements Serializable {
    private static final long serialVersionUID = 1L;
    @EmbeddedId
    protected JobHistoryPK jobHistoryPK;
    @Basic(optional = false)
    @NotNull
    @Column(name = "END_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;
    @JoinColumn(name = "JOB_ID", referencedColumnName = "JOB_ID")
    @ManyToOne(optional = false)
    private Jobs jobId;
    @JoinColumn(name = "EMPLOYEE_ID", referencedColumnName = "EMPLOYEE_ID", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    private Employee employee;
    @JoinColumn(name = "DEPARTMENT_ID", referencedColumnName = "DEPARTMENT_ID")
    @ManyToOne
    private Departments departmentId;

    public JobHistory() {
    }

    public JobHistory(JobHistoryPK jobHistoryPK) {
        this.jobHistoryPK = jobHistoryPK;
    }

    public JobHistory(JobHistoryPK jobHistoryPK, Date endDate) {
        this.jobHistoryPK = jobHistoryPK;
        this.endDate = endDate;
    }

    public JobHistory(int employeeId, Date startDate) {
        this.jobHistoryPK = new JobHistoryPK(employeeId, startDate);
    }

    public JobHistoryPK getJobHistoryPK() {
        return jobHistoryPK;
    }

    public void setJobHistoryPK(JobHistoryPK jobHistoryPK) {
        this.jobHistoryPK = jobHistoryPK;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Jobs getJobId() {
        return jobId;
    }

    public void setJobId(Jobs jobId) {
        this.jobId = jobId;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Departments getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Departments departmentId) {
        this.departmentId = departmentId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (jobHistoryPK != null ? jobHistoryPK.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof JobHistory)) {
            return false;
        }
        JobHistory other = (JobHistory) object;
        if ((this.jobHistoryPK == null && other.jobHistoryPK != null) || (this.jobHistoryPK != null && !this.jobHistoryPK.equals(other.jobHistoryPK))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "ru.homework.hr.entities.auto.JobHistory[ jobHistoryPK=" + jobHistoryPK + " ]";
    }
    
}
