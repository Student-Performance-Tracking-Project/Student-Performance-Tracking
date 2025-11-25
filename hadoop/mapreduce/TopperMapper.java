import java.io.IOException;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Mapper;

public class TopperMapper extends Mapper<LongWritable, Text, Text, Text> {

    @Override
    protected void map(LongWritable key, Text value, Context context)
            throws IOException, InterruptedException {

        // Skip header
        if (key.get() == 0 && value.toString().contains("student_id")) return;

        String[] fields = value.toString().split(",");

        String student = fields[0];
        String subject = fields[1];
        String marks = fields[2];

        context.write(new Text(subject), new Text(student + ":" + marks));
    }
}
