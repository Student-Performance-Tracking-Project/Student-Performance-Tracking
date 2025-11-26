  # Student Performance Tracking — Project Report

  Student Performance Tracking is a small full-stack project that helps collect, manage and analyze student course and marks data. This repository contains a React + TypeScript frontend (built with Vite) for data entry and visual analytics, plus a set of Hadoop MapReduce programs and HBase schema files used for offline analytics processing.

  ---

  ## 📌 Overview

  This project is designed to help educational institutions and instructors track and analyze student performance across courses. It provides a lightweight UI for entering students, courses and marks (for quick demos) and a Hadoop ecosystem (MapReduce + HBase) for scale-out analytics on larger datasets.

  Key components:
  - Frontend web app (React + TypeScript, Vite) — user forms, charts, and data entry (localStorage backed in the current UI).
  - Hadoop MapReduce Java jobs — batch analytics (average marks, top performers and sample loading jobs) located in `hadoop/mapreduce/`.
  - HBase support — schema files and examples in `hadoop/hbase/` to store and query large datasets for analytical workflows.

  ---

  ## 🧭 Problem statement

  Educational institutions often struggle with:
  - collecting and normalizing marks for many students and courses,
  - performing cross-course analytics (average marks, top performers per subject/semester), and
  - scaling analytics to large datasets while retaining support for historical queries.

  This project demonstrates a solution that combines a simple front-end for rapid data entry and visualization with a scalable analytics backend using Hadoop MapReduce and HBase for batch processing and large-scale analytics.

  ---

  ## ✅ Solution & Approach

  - The React UI enables fast prototyping and demoing of the data entry and visualization layer. For now the UI persists data to browser `localStorage` (see `src/services/databaseService.ts`) so you can try the app instantly without a backend.
  - For production or large-scale analytics, the repository includes Java MapReduce jobs (in `hadoop/mapreduce/`) and HBase schema / examples (in `hadoop/hbase/`) to load, store and compute analytics on big datasets.
  - The MapReduce jobs provide examples of typical analytics tasks:
    - Average marks per course / student
    - Ranking / top performers
    - Loading transforming data into HBase-compatible format

  ---

  ## 📦 Tech stack

  - Frontend: React, TypeScript, Vite
  - Styling: CSS Modules / component CSS
  - Offline demo DB: browser localStorage (see `src/services/databaseService.ts`)
  - Analytics: Hadoop MapReduce (Java)
  - Storage / OLAP: Apache HBase (schema in `hadoop/hbase/schema.txt`)
  - Build & tooling: npm, Vite, TypeScript

  ---

  ## 📁 Project structure (high level)

  - /public — static assets
  - /src — front-end app (React + TypeScript)
    - /components — UI building blocks, forms and charts
    - /services — localStorage helpers and data access (`databaseService.ts`)
    - /pages — application pages (analytics, input forms, marks entry)
  - /hadoop
    - /hbase — schema and HBase examples (`schema.txt`)
    - /input — sample CSV data (`student.csv`)
    - /mapreduce — Java MapReduce source files for analytics

  ---

  ## 🔧 How to run (developer / demo)

  The repo contains two primary parts (developer/demo): the frontend app for interactive demo and the Hadoop/HBase artifacts for offline analytics.

  ### 1) Frontend (fast demo — works out-of-the-box)

  Requirements: Node.js 16+ and npm or pnpm/yarn

  From the repository root:

  ```powershell
  cd c:\Users\sahil\Desktop\student-performance
  npm install
  npm run dev
  ```

  The app runs at http://localhost:5173 by default (or a port Vite chooses). Open the UI and use the forms under "Create Data" / "Marks Entry" to add sample students, courses and marks. The UI saves data to your browser's localStorage for the demo.

  Notes:
  - Data is currently saved in-browser. The React service file `src/services/databaseService.ts` implements save/get operations using localStorage. This keeps the demo fast and zero-config.

  ---

  ### 2) Hadoop + MapReduce + HBase (analysis / batch jobs)

  This repository includes Java MapReduce examples that demonstrate how to run analytics at scale. These are provided as reference code to run on a Hadoop/HBase cluster or local pseudo-distributed installation.

  Files of interest:
  - `hadoop/input/student.csv` — sample input CSV for small tests
  - `hadoop/hbase/schema.txt` — example HBase table schema
  - `hadoop/mapreduce/` — AvgMarksDriver/Mapper/Reducer, LoadMarksDriver/Mapper/Reducer, TopperDriver/Mapper/Reducer

  Typical workflow (pseudo-distributed or cluster):

  1. Start Hadoop (namenode, datanode, resource manager, nodemanager) and HBase services.
  2. Create any HBase tables you need using the HBase shell:

  ```text
  # HBase shell example
  create 'students', 'info', 'marks'
  scan 'students'
  put 'students', 'student1', 'info:name', 'John Doe'
  ```

  3. Copy the input CSV(s) to HDFS and run MapReduce jobs.

  ```bash
  # from a shell on the Hadoop cluster / pseudo-distributed node
  hdfs dfs -mkdir -p /user/<youruser>/input
  hdfs dfs -put hadoop/input/student.csv /user/<youruser>/input/

  # Build or create a jar for the MapReduce job (example using javac + jar or Maven)
  # Then run (example):
  hadoop jar student-jobs.jar com.example.mapreduce.AvgMarksDriver /user/<youruser>/input /user/<youruser>/output-averages
  hdfs dfs -cat /user/<youruser>/output-averages/part-* | head
  ```

  4. Optionally write processed results into HBase (or load using `LoadMarksDriver`) and query with the HBase shell or via HBase client APIs.

  Notes & tips:
  - Hadoop/HBase deployments vary — use your cluster-specific `hadoop` and `hbase` commands and classpaths. The jobs provided here are illustrative; if you want a full Maven build, convert the classes to a proper `pom.xml`/Gradle script and package as a single jar with dependencies (uber-jar).

  ---

  ## 🛠 Developer notes

  - Frontend persistence: The app uses localStorage (see `src/services/databaseService.ts`). For a production deployment, replace localStorage with an API backend that persists to HBase or another database.
  - MapReduce examples: The Java artifacts are provided as source under `hadoop/mapreduce/`. They are not part of the frontend build and need to be compiled separately into a jar for execution on Hadoop.
  - HBase: Use the `hadoop/hbase/schema.txt` as a starting point. Customize column families and schema design to match the analytics and query patterns.

  ---

  ## 🔬 Example analytics shown in repository

  - Average marks across all students and per-course (AvgMarks* classes)
  - Load/transformation job (LoadMarks*) to convert CSV into HBase-ready format
  - Topper computation (Topper* classes) to find highest scoring students per course

  ---

  ## 🧩 Future improvements / next steps

  - Add a backend service (Node.js/Express or similar) that connects the frontend to HBase and runs analytics jobs on demand.
  - Add automated packaging for MapReduce jobs (Maven/Gradle) and CI jobs to build and test mapreduce jars.
  - Expand dataset and integration tests for analytics outputs.

  ---

  ## 📚 Resources

  - Apache Hadoop: https://hadoop.apache.org/
  - Apache HBase: https://hbase.apache.org/
  - MapReduce programming guide: https://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html

  ---

  If you'd like, I can also:
  - add a small README in `hadoop/` with step-by-step local instructions to run the MapReduce programs and expected output,
  - create a sample Maven wrapper for the Java jobs to build them reproducibly, or
  - implement a small Node.js API to connect this front-end to HBase for storage.

  Happy to continue — tell me which follow-up you'd like. ✅
