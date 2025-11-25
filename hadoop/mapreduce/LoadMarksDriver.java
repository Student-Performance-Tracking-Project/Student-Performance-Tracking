import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.mapreduce.TableMapReduceUtil;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;

public class LoadMarksDriver {

    public static void main(String[] args) throws Exception {

        if (args.length != 1) {
            System.err.println("Usage: LoadMarksDriver <input_csv_path>");
            System.exit(-1);
        }

        // Hadoop + HBase configuration
        Configuration conf = HBaseConfiguration.create();
        conf.set("hbase.zookeeper.quorum", "localhost");
        conf.set("hbase.zookeeper.property.clientPort", "2181");

        Job job = Job.getInstance(conf, "Load Student Marks into HBase");
        job.setJarByClass(LoadMarksDriver.class);

        // Set Mapper class
        job.setMapperClass(LoadMarksMapper.class);

        // No reducer output to HDFS → write directly to HBase
        job.setNumReduceTasks(1);
        job.setReducerClass(LoadMarksReducer.class);

        // Input CSV file
        FileInputFormat.addInputPath(job, new Path(args[0]));

        // Output → HBase table student_marks
        TableMapReduceUtil.initTableReducerJob(
                "student_marks",         // target table
                LoadMarksReducer.class,  // reducer class
                job
        );

        System.out.println("⏳ Running MapReduce job...");

        boolean success = job.waitForCompletion(true);

        if (success) {
            System.out.println("✅ Successfully loaded data into HBase: student_marks table");
        } else {
            System.out.println("❌ Job failed.");
        }

        System.exit(success ? 0 : 1);
    }
}
