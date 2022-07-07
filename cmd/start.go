package cmd

import (
	"github.com/spf13/cobra"
	"github.com/zoubingwu/quicksql/service"
)

func init() {
	rootCmd.AddCommand(startCmd)
}

var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start server and open editor in browser",
	Run: func(cmd *cobra.Command, args []string) {
		service.Start()
	},
}
