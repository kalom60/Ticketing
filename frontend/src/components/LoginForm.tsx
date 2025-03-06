import { Component } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppDispatch, RootState } from "../redux/store";
import { loginUser } from "../redux/authSlice";
import { connect } from "react-redux";

interface LoginProps {
  loading: boolean;
  error: string | null;
  loginUser: (
    form: { email: string; password: string },
    navigate: NavigateFunction
  ) => void;
  navigate: NavigateFunction;
}

interface LoginState {
  email: string;
  password: string;
}

export class LoginForm extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [e.target.name]: e.target.value,
    } as unknown as LoginState);
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.loginUser(
      {
        email: this.state.email,
        password: this.state.password,
      },
      this.props.navigate
    );
  };

  render() {
    const { email, password } = this.state;
    const { loading } = this.props;

    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-balance text-muted-foreground">
              Login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={this.handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> Please wait
                    </>
                  ) : (
                    <>Login</>
                  )}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}

const LoginFormWrapper = (props: LoginProps) => {
  const navigate = useNavigate();

  return <LoginForm {...props} navigate={navigate} />;
};

const mapStateToProps = (state: RootState) => ({
  loading: state.auth.loading,
  error: state.auth.error,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  loginUser: (
    form: { email: string; password: string },
    navigate: NavigateFunction
  ) => dispatch(loginUser({ credentials: form, navigate })),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginFormWrapper);
