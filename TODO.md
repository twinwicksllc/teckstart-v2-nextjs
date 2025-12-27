# Future Enhancements & Roadmap

## AI Receipt Processing
- [ ] **Context-Aware Parsing**: Implement logic to use "similar receipts" (same vendor/filename) as few-shot examples for the AI.
    - *Goal*: Teach the AI to look at specific areas for important information based on past successful parses.
    - *Benefit*: Reduce token usage and improve accuracy for recurring expenses.
    - *Implementation Note*: The `similarReceipt` query was temporarily removed from `src/lib/receipt-processor.ts` to clean up dead code. Restore this when implementing the feature.
