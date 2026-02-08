export class Service<Repository> {
  protected repository: Repository

  constructor(repo: Repository) {
    this.repository = repo
  }
}
