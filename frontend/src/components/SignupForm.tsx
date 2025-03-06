import React, { Component } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AppDispatch, RootState } from "../redux/store";
import { signupUser } from "../redux/authSlice";
import { connect } from "react-redux";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface SignupProps {
  loading: boolean;
  error: string | null;
  signupUser: (
    form: {
      email: string;
      password: string;
      role: string | undefined;
    },
    navigate: NavigateFunction
  ) => void;
  navigate: NavigateFunction;
}

interface SignupState {
  email: string;
  password: string;
  role: string | undefined;
}

class SignupForm extends Component<SignupProps, SignupState> {
  constructor(props: SignupProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
      role: undefined,
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [e.target.name]: e.target.value,
    } as unknown as SignupState);
  };

  handleRoleChange = (value: string) => {
    this.setState({
      role: value,
    });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.signupUser(
      {
        email: this.state.email,
        password: this.state.password,
        role: this.state.role,
      },
      this.props.navigate
    );
  };

  render() {
    const { email, password, role } = this.state;
    const { loading } = this.props;

    return (
      <div className="flex flex-col gap-6">
        <form onSubmit={this.handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-xl font-bold">Welcome to Ticketing System</h1>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={this.handleRoleChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> Please wait
                  </>
                ) : (
                  <>Sign up</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const SignupFormWrapper = (props: any) => {
  const navigate = useNavigate();

  return <SignupForm {...props} navigate={navigate} />;
};

const mapStateToProps = (state: RootState) => ({
  loading: state.auth.loading,
  error: state.auth.error,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  signupUser: (
    form: { email: string; password: string; role: string | undefined },
    navigate: NavigateFunction
  ) => dispatch(signupUser({ userData: form, navigate })),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupFormWrapper);
