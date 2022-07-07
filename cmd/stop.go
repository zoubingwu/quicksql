package cmd

import (
	"github.com/spf13/cobra"
	"github.com/zoubingwu/quicksql/service"
)

func init() {
	rootCmd.AddCommand(stopCmd)
}

var stopCmd = &cobra.Command{
	Use:   "stop",
	Short: "Stop server",
	Run: func(cmd *cobra.Command, args []string) {
		service.StopDaemon()
	},
}
