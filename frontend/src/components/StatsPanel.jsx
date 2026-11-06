function StatsPanel({ analysisResults }) {
  return (
    <section>
      <h2>Analysis Results</h2>
      <h1>Results:</h1>

      {analysisResults ? (
        <>
          <p>Filename: {analysisResults.filename}</p>
          <p>Row count: {analysisResults.row_count}</p>

          <h2>Channel Averages:</h2>

          {Object.entries(analysisResults.averages).map(
            ([channel, average]) => (
              <p key={channel}>
                {channel}: {average}
              </p>
            ),
          )}
        </>
      ) : (
        <p>No analysis available yet.</p>
      )}
    </section>
  );
}

export default StatsPanel;
