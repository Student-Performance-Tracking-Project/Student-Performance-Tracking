import java.io.IOException;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Mapper;

public class AvgMarksMapper extends Mapper<LongWritable, Text, Text, IntWritable> {

    @Override
    protected void map(LongWritable key, Text value, Context context)
            throws IOException, InterruptedException {

        // Skip header
        if (key.get() == 0 && value.toString().contains("student_id")) return;

        String[] fields = value.toString().split(",");

        String subject = fields[1];
        int marks = Integer.parseInt(fields[2]);

        context.write(new Text(subject), new IntWritable(marks));
    }
}
