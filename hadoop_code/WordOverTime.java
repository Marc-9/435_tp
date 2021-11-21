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

public class WordOverTime {
    public static class WordAndDate extends Mapper<Object, Text, Text, IntWritable> {
        @Override
        protected void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            String s = value.toString();
            String[] elements = s.split("~~");
            if(!elements[0].equals("nan")){
                DateTimeFormatter format = DateTimeFormatter.RFC_1123_DATE_TIME;
                LocalDate date = LocalDate.parse(elements[0], format);
                for(int i = 1; i < elements.length; i++){
                    String[] words = elements[i].split("\\|\\|");
                    String newWord = words[0].toLowerCase().replaceAll("[^a-z]+", "");
                    if(newWord.length() == 0){
                        continue;
                    }

                    Text word = new Text(date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))+"-"+newWord);
                    context.write(word,new IntWritable(1));
                }
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
        Job job = Job.getInstance(conf, "Word Over Time");
        job.setJarByClass(WordOverTime.class);
        job.setMapperClass(WordOverTime.WordAndDate.class);
        job.setReducerClass(WordOverTime.SumCounts.class);
        job.setNumReduceTasks(1);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);
        FileInputFormat.addInputPath(job, new Path(args[1]));
        FileOutputFormat.setOutputPath(job, new Path(args[2]));
        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}
