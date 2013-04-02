package ru.homework.hr.entities;

import java.io.Serializable;
import java.sql.Date;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class JobsHistory implements Serializable {
    @EmbeddedId
    private JobHistoryPK jhPrimaryKey;
    
    
    
	/**
	 * 
	 */
	private static final long serialVersionUID = 7170477038900802627L;

}
