package main

import (
	"context"
	"embed"
	"net/http"
	"path/filepath"
	"runtime"

	"github.com/go-chi/chi"
	"go-micro.dev/v4"

	"github.com/owncloud/ocis/v2/ocis-pkg/assetsfs"
	"github.com/owncloud/ocis/v2/ocis-pkg/log"
	ohttp "github.com/owncloud/ocis/v2/ocis-pkg/service/http"
)

//go:embed ui/dist/*
var assets embed.FS

const serviceName = "arcade"
const httpRoot = "/sample/" + serviceName

func main() {
	logger := log.NewLogger()
	ctx := context.Background()
	service, _ := ohttp.NewService(
		ohttp.Name(serviceName),
		ohttp.Namespace("com.owncloud.sample"),
		ohttp.Address("127.0.0.1:0"),
		ohttp.Context(ctx),
	)

	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		logger.Info().Msg("failed to obtain root")
	}

	if err := micro.RegisterHandler(service.Server(), Service{
		log:  logger,
		root: filepath.Dir(filename),
	}); err != nil {
		logger.Fatal().Err(err)
	}

	if err := service.Run(); err != nil {
		logger.Fatal().Err(err)
	}
}

type Service struct {
	root string
	log  log.Logger
}

func (s Service) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	mux := chi.NewMux()
	mux.Route(httpRoot, func(r chi.Router) {
		r.Get(
			"/ui/*",
			http.StripPrefix(
				httpRoot,
				http.FileServer(
					assetsfs.New(assets, s.root, s.log)),
			).ServeHTTP,
		)
	})

	mux.ServeHTTP(w, r)
}
