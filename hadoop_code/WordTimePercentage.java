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

public class WordTimePercentage {
    public static class WordPercentage extends Mapper<Object, Text, Text, IntWritable> {
        @Override
        protected void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            String s = value.toString();
            String[] elements = s.split("~~");

            float podcast_length = Float.parseFloat(elements[elements.length-1].split("\\|\\|")[2]);
            for(int i = 1; i < elements.length; i++){
                String[] words = elements[i].split("\\|\\|");
                String newWord = words[0].toLowerCase().replaceAll("[^a-z]+", "");
                if(newWord.length() == 0){
                    continue;
                }
                double timeSaid = Math.ceil((Float.parseFloat(words[1]) / podcast_length * 100f)) + 1;
                Text word = new Text(Double.toString(timeSaid)+"-"+newWord);
                context.write(word,new IntWritable(1));
            }

        }
    }
    public static class SumCounts extends Reducer<Text, IntWritable, Text, IntWritable>{

        @Override
        protected void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException{
            int count = 0;
            for(IntWritable val : values){
                count++;
            }
            context.write(key, new IntWritable(count));

        }

    }





    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "Word Over Podcast Length");
        job.setJarByClass(WordTimePercentage.class);
        job.setMapperClass(WordTimePercentage.WordPercentage.class);
        job.setReducerClass(WordTimePercentage.SumCounts.class);
        //job.setNumReduceTasks(1);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);
        FileInputFormat.addInputPath(job, new Path(args[1]));
        FileOutputFormat.setOutputPath(job, new Path(args[2]));
        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}
