package com.homework.hr.entities;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="jobs")
public class Job implements Serializable {
	
	@Id
	@Column(name="JOB_ID")
	private String id;
	
	@Column(name="JOB_TITLE")
	private String jobTitle;
	
	@Column(name="MAX_SALARY")
	private BigDecimal maxSalary;
	
	@Column(name="MIN_SALARY")
	private BigDecimal minSalary;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public BigDecimal getMaxSalary() {
		return maxSalary;
	}

	public void setMaxSalary(BigDecimal maxSalary) {
		this.maxSalary = maxSalary;
	}

	public BigDecimal getMinSalary() {
		return minSalary;
	}

	public void setMinSalary(BigDecimal minSalary) {
		this.minSalary = minSalary;
	}

	@Override
	public String toString() {
		return "[id=" + id + ", jobTitle=" + jobTitle + ", maxSalary="
				+ maxSalary + ", minSalary=" + minSalary + "]";
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = -9177554031306162265L;

}
