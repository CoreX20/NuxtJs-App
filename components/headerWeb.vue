<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-transparent">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Tugas 2 NuxtJs</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbarSupportedContent" class="collapse navbar-collapse">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0 text-center gap-5">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/"> Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="/genre">Genre</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="/rates">Top Rates</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" aria-current="page" href="/movie">Movie</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>