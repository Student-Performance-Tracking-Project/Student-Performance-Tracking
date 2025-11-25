import java.io.IOException;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

/*
 * Input CSV format:
 * student_id,subject,marks,exam,date
 *
 * RowKey = studentId#subject
 * ColumnFamily = marks
 * Columns:
 *   marks:score
 *   marks:exam
 *   marks:date
 */

public class LoadMarksMapper extends Mapper<LongWritable, Text, Text, Text> {

    @Override
    protected void map(LongWritable key, Text value, Context context)
            throws IOException, InterruptedException {

        String line = value.toString();

        // Skip header
        if (line.startsWith("student_id")) return;

        // Split CSV
        String[] parts = line.split(",");

        if (parts.length < 5) return;

        String studentId = parts[0];
        String subject   = parts[1];
        String marks     = parts[2];
        String exam      = parts[3];
        String date      = parts[4];

        // RowKey
        String rowkey = studentId + "#" + subject;

        // Value format we send → score|exam|date
        String combined = marks + "|" + exam + "|" + date;

        context.write(new Text(rowkey), new Text(combined));
    }
}
