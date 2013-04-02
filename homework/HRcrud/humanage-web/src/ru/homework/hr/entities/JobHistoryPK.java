/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package ru.homework.hr.entities;

import java.io.Serializable;
import java.sql.Date;
import javax.persistence.Embeddable;

/**
 *
 * @author mgr
 */
@Embeddable
public class JobHistoryPK implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Date startDate;
    private Long employeeId;

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    
    
}
