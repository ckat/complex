package com.homework.hr.entities;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name="EMPLOYEES")
@NamedQueries({
		@NamedQuery(name="Employee.allEmployees", query="SELECT emp FROM Employee emp" )
		})
public class Employee implements Serializable  {
	@Id
	@Column(name="EMPLOYEE_ID")
	private Long id;
	
	@Column(name="FIRST_NAME")
	private String firstName;
	
	@Column(name="HIRE_DATE")
	private Date hireDate;
	
	@ManyToOne
	@JoinColumn(name="JOB_ID",referencedColumnName="JOB_ID")
	private Job job;
	
	@Override
	public String toString() {
		return "[id=" + id + ", firstName=" + firstName + ", job="
				+ job + "]";
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public Date getHireDate() {
		return hireDate;
	}
	public void setHireDate(Date hireDate) {
		this.hireDate = hireDate;
	}
	/**
	 * 
	 */
	private static final long serialVersionUID = -5900334951240414217L;

}
