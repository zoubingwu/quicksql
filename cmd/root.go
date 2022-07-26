package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/zoubingwu/quicksql/service"
)

var (
	Host string
	Port int
	User string
)

var rootCmd = &cobra.Command{
	Use:     "qs",
	Short:   "QuickSQL is a collaborative SQL Editor",
	Version: Version,
	Run: func(cmd *cobra.Command, args []string) {
		service.NewServer(Host, Port, User)
	},
}

func init() {
	rootCmd.PersistentFlags().BoolP("help", "", false, "help for this command")
	rootCmd.Flags().StringVarP(&Host, "host", "h", "", "Host (required)")
	rootCmd.Flags().IntVarP(&Port, "port", "P", 3306, "Port")
	rootCmd.Flags().StringVarP(&User, "user", "u", "root", "User")
	rootCmd.MarkFlagRequired("host")
}

func Execute() {
	rootCmd.SetVersionTemplate(VersionTemplate)
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
