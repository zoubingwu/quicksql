package cmd

import (
	"fmt"
	"runtime"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(versionCmd)
}

var Version = "0.1.0"
var VersionTemplate = fmt.Sprintf("QuickSQL v%s/%s-%s\n", Version, runtime.GOOS, runtime.GOARCH)

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of QuickSQL",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf(VersionTemplate)
	},
}
