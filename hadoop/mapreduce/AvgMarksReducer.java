import java.io.IOException;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.util.Bytes;

public class AvgMarksReducer extends Reducer<Text, IntWritable, Text, IntWritable> {

    private Connection connection;
    private Table table;

    @Override
    protected void setup(Context context) throws IOException {
        connection = ConnectionFactory.createConnection();
        table = connection.getTable(TableName.valueOf("student_analytics"));
    }

    @Override
    protected void reduce(Text key, Iterable<IntWritable> values, Context context)
            throws IOException, InterruptedException {

        int sum = 0, count = 0;

        for (IntWritable v : values) {
            sum += v.get();
            count++;
        }

        int avg = sum / count;

        // RowKey = subject#Average
        Put put = new Put(Bytes.toBytes(key.toString() + "#Average"));
        put.addColumn(Bytes.toBytes("stats"), Bytes.toBytes("avg"), Bytes.toBytes(avg));

        table.put(put);

        context.write(key, new IntWritable(avg));
    }

    @Override
    protected void cleanup(Context context) throws IOException {
        table.close();
        connection.close();
    }
}
