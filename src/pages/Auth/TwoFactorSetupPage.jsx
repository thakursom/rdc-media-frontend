import TwoFactorSetup from "../../components/Auth/TwoFactorSetup";

function TwoFactorSetupPage() {
    return (
        <main className="main-content headerWidth">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <TwoFactorSetup />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default TwoFactorSetupPage;
