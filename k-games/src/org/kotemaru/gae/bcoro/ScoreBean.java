package org.kotemaru.gae.bcoro;
import java.util.Date;

import org.kotemaru.gae.storedbean.StoredBean;


public class ScoreBean implements StoredBean {

	private static final long serialVersionUID = 1L;
	
	private String game;
	private String name;
	private String stage;
	private Long score;
	private Date date;

	public String getGame() {
		return game;
	}
	public void setGame(String game) {
		this.game = game;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getStage() {
		return stage;
	}
	public void setStage(String stage) {
		this.stage = stage;
	}
	public Long getScore() {
		return score;
	}
	public void setScore(Long score) {
		this.score = score;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	


}
