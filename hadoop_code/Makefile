
JAVA_COMPILE = $(HADOOP_HOME)/bin/hadoop com.sun.tools.javac.Main
HADOOP_RUN = $(HADOOP_HOME)/bin/hadoop jar code.jar
INPUT_NAME = /podcastTest
OUTPUT_NAME = /outTest

run:
	$(HADOOP_RUN) cs435.TP.TimeVariancePerWord $(INPUT_NAME) $(OUTPUT_NAME)

jar:
	jar cf code.jar cs435

