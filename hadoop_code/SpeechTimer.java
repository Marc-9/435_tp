package cs435.P2;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.FloatWritable;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import java.io.IOException;
import java.util.StringTokenizer;
import java.util.Comparator;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Arrays;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class SpeechTimer {
	public static class CountWords extends Mapper<Object, Text, Text, FloatWritable> {
		@Override
		protected void map(Object key, Text value, Context context) throws IOException, InterruptedException {
			StringTokenizer itr = new StringTokenizer(value.toString());
			while (itr.hasMoreTokens()) {
				String s = itr.nextToken();
				String[] elements = s.split("~~");
				/* Parse date of podcast
				if(!elements[0].equals("nan")){
					DateTimeFormatter format = DateTimeFormatter.RFC_1123_DATE_TIME;
					LocalDate date = LocalDate.parse(elements[0], format);
				}
				*/
				for(int i = 1; i < elements.length; i++){
					String[] words = elements[i].split("\\|\\|");
					String newWord = words[0].toLowerCase().replaceAll("[^a-z]+", "");
					float startTime = Float.valueOf(words[1]);
					float endTime = Float.valueOf(words[2]);
					float deltaTime = endTime - startTime;
					Text word = new Text(newWord);
					FloatWritable timeTook = new FloatWritable(deltaTime);
					context.write(word, timeTook);
				}
				
			}
 		}
	}	
	public static class DeltaTime extends Reducer<Text, FloatWritable, Text, Text>{
		
		List<Word> sortedList;
		@Override
		protected void setup(Context context) {
			sortedList = new ArrayList<Word>();
	 	}

		@Override
		protected void reduce(Text key, Iterable<FloatWritable> values, Context context){
			int count = 0;
			float totalTime = 0;
			for(FloatWritable time : values){
				count++;
				totalTime += time.get();
			}
			if(count > 99){
				float avgTime = totalTime / count;
				sortedList.add(new Word(key, avgTime, count));
			}

		 }

		@Override
		protected void cleanup(Context context) throws IOException, InterruptedException {
			Collections.sort(sortedList, new CustomComparator());
			for(int i = 0; i < sortedList.size(); i++) {
				context.write(new Text(sortedList.get(i).key), new Text(sortedList.get(i).avgTime + "\t" + sortedList.get(i).count));
			}
		}

	}

	public static class Word{
		String key;
		float avgTime;
		int count;

		Word(Text key, float time, int count){
			this.key = key.toString();
			this.avgTime = time;
			this.count = count;
		}
	}

	public static class CustomComparator implements Comparator<Word>{
		@Override
		public int compare(Word o1, Word o2){
			if (o1.avgTime > o2.avgTime){
				return -1;
			}
			else if(o1.avgTime < o2.avgTime){
				return 1;
			}
			else{
				return o1.key.compareTo(o2.key);
			}
		}
	}


	public static void main(String[] args) throws Exception {
		Configuration conf = new Configuration();
		Job job = Job.getInstance(conf, "Time Per Word");
		job.setJarByClass(SpeechTimer.class);
		job.setMapperClass(SpeechTimer.CountWords.class);
		job.setReducerClass(SpeechTimer.DeltaTime.class);
		job.setNumReduceTasks(1);
		job.setMapOutputKeyClass(Text.class);
		job.setMapOutputValueClass(FloatWritable.class);
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(Text.class);
		FileInputFormat.addInputPath(job, new Path(args[1]));
		FileOutputFormat.setOutputPath(job, new Path(args[2])); 
		System.exit(job.waitForCompletion(true) ? 0 : 1);
	}
}
