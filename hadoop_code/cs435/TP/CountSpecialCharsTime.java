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

public class CountSpecialCharsTime {
    public static class CharsMapper extends Mapper<Object, Text, Text, FloatWritable> {
		@Override
		protected void map(Object key, Text value, Context context) throws IOException, InterruptedException {
			String s = value.toString();
			String[] elements = s.split("~~");

            boolean lastWordSpecial = false;
            float lastWordSpecialTime = 0;
			String lastWord = "";
			for(int i = 1; i < elements.length; i++){
				String[] words = elements[i].split("\\|\\|");
				
                String word = words[0];
				boolean charInWord = word.endsWith(".") || word.endsWith(",");
                float startTime = Float.valueOf(words[1]);
                float endTime = Float.valueOf(words[2]);
                if(charInWord){
                    lastWordSpecial = true;
                    lastWordSpecialTime = endTime;
					lastWord = word;
                }else{
                    if(lastWordSpecial){
                        FloatWritable timeTook = new FloatWritable(startTime - lastWordSpecialTime);
						String punctuation = lastWord.charAt(lastWord.length() - 1) + "";
                        context.write(new Text(punctuation), timeTook);
                    }
                    lastWordSpecial = false; //reset variable
                }
			}

		}
	}


	public static void main(String[] args) throws Exception {
		Configuration conf = new Configuration();
		Job job = Job.getInstance(conf, "Count Time Between '.,' and next word");
		job.setJarByClass(CountSpecialCharsTime.class);
		job.setMapperClass(CountSpecialCharsTime.CharsMapper.class);
		job.setReducerClass(SpeechTimer.DeltaTime.class);
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
