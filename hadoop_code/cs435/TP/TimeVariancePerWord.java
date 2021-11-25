package cs435.TP;
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
import java.lang.Math;

public class TimeVariancePerWord {
	public static class VarianceReducer extends Reducer<Text, FloatWritable, Text, Text>{

		@Override
		protected void reduce(Text key, Iterable<FloatWritable> values, Context context) throws IOException, InterruptedException {
			//variance is calculated as s^2 = sum(math.pow(x-mean, 2))/n
			List<Float> times = new ArrayList<>(); 

			int count = 0;
			float totalTime = 0;
			for(FloatWritable time : values){
				count++;
				totalTime += time.get();
				times.add(time.get());
			}

			float mean = totalTime / count;

			float var = 0;
			for(Float time : times){
				float diff = time-mean;
				var += Math.pow(diff, 2);
			}
			var = var / count;

			// String data = "";
			// for(Float time : times){
			// 	data += time + " ";
			// }
			context.write(key, new Text(var + ""));

		}

	}


	public static void main(String[] args) throws Exception {
		Configuration conf = new Configuration();
		Job job = Job.getInstance(conf, "Variance in Time Per Word");
		job.setJarByClass(TimeVariancePerWord.class);
		job.setMapperClass(SpeechTimer.CountWords.class);
		job.setReducerClass(TimeVariancePerWord.VarianceReducer.class);
		job.setNumReduceTasks(1);
		job.setMapOutputKeyClass(Text.class);
		job.setMapOutputValueClass(FloatWritable.class);
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(Text.class);
		FileInputFormat.addInputPath(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));
		System.exit(job.waitForCompletion(true) ? 0 : 1);
	}
}
