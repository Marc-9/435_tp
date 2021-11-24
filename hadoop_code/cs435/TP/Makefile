
JAVA_COMPILE = $(HADOOP_HOME)/bin/hadoop com.sun.tools.javac.Main
HADOOP_RUN = $(HADOOP_HOME)/bin/hadoop jar code.jar
INPUT_NAME = /podcastTest


default: *.java
	$(JAVA_COMPILE) *.java

run:
	$(HADOOP_RUN) cs435/TP/TimeVariancePerWord $(INPUT_NAME)

clean:
	rm -rf *.class

jar:
	jar cf code.jar *.class

