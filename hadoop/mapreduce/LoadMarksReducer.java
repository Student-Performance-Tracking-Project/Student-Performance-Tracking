import java.io.IOException;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.io.ImmutableBytesWritable;
import org.apache.hadoop.hbase.util.Bytes;

public class LoadMarksReducer extends Reducer<Text, Text, ImmutableBytesWritable, Put> {

    private static final byte[] CF = Bytes.toBytes("marks");
    private static final byte[] COL_SCORE = Bytes.toBytes("score");
    private static final byte[] COL_EXAM = Bytes.toBytes("exam");
    private static final byte[] COL_DATE = Bytes.toBytes("date");

    @Override
    protected void reduce(Text key, Iterable<Text> values, Context context)
            throws IOException, InterruptedException {

        // key = "studentId#subject"
        // value = "marks,exam,date"

        for (Text t : values) {
            String[] parts = t.toString().split(",");

            String marks = parts[0];
            String exam = parts[1];
            String date = parts[2];

            Put put = new Put(Bytes.toBytes(key.toString()));

            put.addColumn(CF, COL_SCORE, Bytes.toBytes(marks));
            put.addColumn(CF, COL_EXAM, Bytes.toBytes(exam));
            put.addColumn(CF, COL_DATE, Bytes.toBytes(date));

            context.write(new ImmutableBytesWritable(Bytes.toBytes(key.toString())), put);
        }
    }
}
