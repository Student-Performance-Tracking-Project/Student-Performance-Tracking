import java.io.IOException;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.util.Bytes;

public class TopperReducer extends Reducer<Text, Text, Text, Text> {

    private Connection connection;
    private Table table;

    @Override
    protected void setup(Context context) throws IOException {
        connection = ConnectionFactory.createConnection();
        table = connection.getTable(TableName.valueOf("student_analytics"));
    }

    @Override
    protected void reduce(Text key, Iterable<Text> values, Context context)
            throws IOException, InterruptedException {

        String topper = "";
        int maxMarks = -1;

        for (Text v : values) {
            String[] parts = v.toString().split(":");
            int marks = Integer.parseInt(parts[1]);

            if (marks > maxMarks) {
                maxMarks = marks;
                topper = parts[0];
            }
        }

        // RowKey: subject#Topper
        Put put = new Put(Bytes.toBytes(key.toString() + "#Topper"));
        put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("student"), Bytes.toBytes(topper));
        put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("marks"), Bytes.toBytes(maxMarks));

        table.put(put);

        context.write(new Text(key), new Text(topper + ":" + maxMarks));
    }

    @Override
    protected void cleanup(Context context) throws IOException {
        table.close();
        connection.close();
    }
}
